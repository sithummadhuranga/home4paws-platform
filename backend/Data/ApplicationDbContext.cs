using Microsoft.EntityFrameworkCore;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IWebHostEnvironment _environment;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IWebHostEnvironment environment) 
            : base(options)
        {
            _environment = environment;
        }

        // DbSets for your entities
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserSession> UserSessions { get; set; } = null!;
        public DbSet<PetReport> PetReports { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure schema based on environment
            var schema = _environment.IsDevelopment() ? "development" : "production";
            modelBuilder.HasDefaultSchema(schema);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FirstName).HasColumnName("first_name").HasMaxLength(50).IsRequired();
                entity.Property(e => e.LastName).HasColumnName("last_name").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash").HasMaxLength(500).IsRequired();
                entity.Property(e => e.Role).HasColumnName("role").HasMaxLength(20).HasDefaultValue("User");
                entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
                entity.Property(e => e.EmailVerified).HasColumnName("email_verified").HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.LastLoginAt).HasColumnName("last_login_at");

                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.IsActive);
            });

            // Configure UserSession entity
            modelBuilder.Entity<UserSession>(entity =>
            {
                entity.ToTable("user_sessions");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
                entity.Property(e => e.Token).HasColumnName("token").IsRequired();
                entity.Property(e => e.RefreshToken).HasColumnName("refresh_token").HasMaxLength(500).IsRequired();
                entity.Property(e => e.ExpiresAt).HasColumnName("expires_at").IsRequired();
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
                entity.Property(e => e.DeviceInfo).HasColumnName("device_info");
                entity.Property(e => e.IpAddress).HasColumnName("ip_address").HasMaxLength(45);

                entity.HasIndex(e => e.RefreshToken).IsUnique();
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.ExpiresAt);

                // Foreign key relationship
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Sessions)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure PetReport entity
            modelBuilder.Entity<PetReport>(entity =>
            {
                entity.ToTable("pet_reports");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasDefaultValueSql("gen_random_uuid()");
                entity.Property(e => e.Type).HasColumnName("type").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Breed).HasColumnName("breed").HasMaxLength(100);
                entity.Property(e => e.Color).HasColumnName("color").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Age).HasColumnName("age").HasMaxLength(20).IsRequired();
                entity.Property(e => e.Gender).HasColumnName("gender").HasMaxLength(20).IsRequired();
                entity.Property(e => e.Size).HasColumnName("size").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Description).HasColumnName("description").HasMaxLength(1000);
                entity.Property(e => e.ReportType).HasColumnName("report_type").HasMaxLength(20).IsRequired();
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
                entity.Property(e => e.DateReported).HasColumnName("date_reported").HasDefaultValueSql("NOW()");
                entity.Property(e => e.LostOrFoundDate).HasColumnName("lost_or_found_date").IsRequired();
                entity.Property(e => e.Location).HasColumnName("location").HasMaxLength(200).IsRequired();
                entity.Property(e => e.Latitude).HasColumnName("latitude").HasColumnType("double precision");
                entity.Property(e => e.Longitude).HasColumnName("longitude").HasColumnType("double precision");
                entity.Property(e => e.ContactName).HasColumnName("contact_name").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(10).IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
                entity.Property(e => e.PhotoUrls).HasColumnName("photo_urls").HasColumnType("jsonb");
                entity.Property(e => e.IdentifyingFeatures).HasColumnName("identifying_features").HasMaxLength(1000);
                entity.Property(e => e.MedicalConditions).HasColumnName("medical_conditions").HasMaxLength(500);
                entity.Property(e => e.IsChipped).HasColumnName("is_chipped");
                entity.Property(e => e.ChipNumber).HasColumnName("chip_number").HasMaxLength(50);
                entity.Property(e => e.HasReward).HasColumnName("has_reward");
                entity.Property(e => e.RewardAmount).HasColumnName("reward_amount").HasMaxLength(20);
                entity.Property(e => e.Views).HasColumnName("views");
                entity.Property(e => e.IsUrgent).HasColumnName("is_urgent");
                entity.Property(e => e.IsClosed).HasColumnName("is_closed");
                entity.Property(e => e.ClosedAt).HasColumnName("closed_at");
                entity.Property(e => e.ClosureReason).HasColumnName("closure_reason").HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");
                entity.Property(e => e.AdminNotes).HasColumnName("admin_notes").HasMaxLength(500);

                // Indexes for common queries
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.ReportType);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Location);
                entity.HasIndex(e => e.LostOrFoundDate);
                
                // Create spatial index
                entity.HasIndex(e => new { e.Latitude, e.Longitude })
                    .HasDatabaseName("IX_PetReports_Location_Spatial");
            });
        }
    }
}